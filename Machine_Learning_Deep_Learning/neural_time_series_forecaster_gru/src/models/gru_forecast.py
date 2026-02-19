import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import GRU, Dense, Dropout, Input
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau

class GRUForecaster:
    def __init__(self, input_shape, units_1=64, units_2=32, dropout=0.2, learning_rate=0.001):
        self.input_shape = input_shape
        self.units_1 = units_1
        self.units_2 = units_2
        self.dropout = dropout
        self.learning_rate = learning_rate
        self.model = self._build_model()
        
    def _build_model(self):
        model = Sequential([
            Input(shape=self.input_shape),
            GRU(self.units_1, return_sequences=True),
            Dropout(self.dropout),
            GRU(self.units_2, return_sequences=False),
            Dropout(self.dropout),
            Dense(1) # Forecasting 1 step ahead (consumption)
        ])
        
        optimizer = Adam(learning_rate=self.learning_rate)
        model.compile(optimizer=optimizer, loss='mse', metrics=['mae'])
        return model
        
    def train(self, X_train, y_train, X_val, y_val, epochs=50, batch_size=32):
        callbacks = [
            EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True),
            ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=5, min_lr=1e-5)
        ]
        
        history = self.model.fit(
            X_train, y_train,
            validation_data=(X_val, y_val),
            epochs=epochs,
            batch_size=batch_size,
            callbacks=callbacks,
            verbose=1
        )
        return history
        
    def predict(self, X):
        return self.model.predict(X)
        
    def save(self, path):
        self.model.save(path)
        
    def load(self, path):
        self.model = tf.keras.models.load_model(path)
