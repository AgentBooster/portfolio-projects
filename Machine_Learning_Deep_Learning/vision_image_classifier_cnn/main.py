import tensorflow as tf
x = tf.random.normal([1024, 1024])
y = tf.random.normal([1024, 1024])
z = tf.matmul(x, y)
print("OK:", z.shape)
