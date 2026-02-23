# README

For this project, I implemented a simple CNN model in `traffic.py` with two convolutional layers (32 and 64 filters), max pooling, a dense layer of 128 neurons, and a dropout of 0.5. Keeping the model compact helped to train quickly with the full dataset. With 10 epochs, the evaluation on the test set yielded an accuracy of approximately 95.8%, indicating that the approach works well for classifying the 43 categories.

I did not perform an exhaustive search of architectures; I stuck with this baseline because it already exceeded 0.9 accuracy and training was stable. If I wanted to improve, I would try more filters, more layers, or data augmentation, and also adjust the dropout and number of epochs to see if any gains could be made without overfitting.
