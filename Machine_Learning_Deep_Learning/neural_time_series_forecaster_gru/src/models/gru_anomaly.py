import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import GRU, Dense, Input, RepeatVector, TimeDistributed, Dropout
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
import numpy as np

class GRUAnomalyDetector:
    def __init__(self, input_shape, latent_dim=32, dropout=0.2, learning_rate=0.001):
        self.input_shape = input_shape # (seq_len, n_features)
        self.latent_dim = latent_dim
        self.dropout = dropout
        self.learning_rate = learning_rate
        self.model = self._build_model()
        self.threshold = None
        
    def _build_model(self):
        seq_len = self.input_shape[0]
        n_features = self.input_shape[1]
        
        # Encoder
        inputs = Input(shape=self.input_shape)
        encoded = GRU(self.latent_dim, return_sequences=False)(inputs)
        encoded = Dropout(self.dropout)(encoded)
        
        # Decoder
        decoded = RepeatVector(seq_len)(encoded)
        decoded = GRU(self.latent_dim, return_sequences=True)(decoded)
        decoded = Dropout(self.dropout)(decoded)
        outputs = TimeDistributed(Dense(n_features))(decoded)
        
        model = Model(inputs, outputs)
        optimizer = Adam(learning_rate=self.learning_rate)
        model.compile(optimizer=optimizer, loss='mse')
        return model
        
    def train(self, X_train, X_val, epochs=50, batch_size=32):
        # Autoencoder target is X_train (reconstruct input)
        callbacks = [
            EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True),
            ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=5, min_lr=1e-5)
        ]
        
        history = self.model.fit(
            X_train, X_train,
            validation_data=(X_val, X_val),
            epochs=epochs,
            batch_size=batch_size,
            callbacks=callbacks,
            verbose=1 # Progress bar
        )
        return history
        
    def compute_reconstruction_error(self, X):
        predictions = self.model.predict(X)
        # MSE per sequence (global anomaly in window)
        mse = np.mean(np.power(X - predictions, 2), axis=(1, 2))
        return mse
        
    def find_threshold(self, X_normal, percentile=99):
        errors = self.compute_reconstruction_error(X_normal)
        self.threshold = np.percentile(errors, percentile)
        return self.threshold
        
    def detect(self, X):
        if self.threshold is None:
            raise ValueError("Threshold not set. Call find_threshold first.")
        errors = self.compute_reconstruction_error(X)
        anomalies = errors > self.threshold
        return anomalies, errors
        
    def save(self, path):
        self.model.save(path)
        
    def load(self, path):
        self.model = tf.keras.models.load_model(path)
