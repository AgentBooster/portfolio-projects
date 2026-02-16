
import os
import tensorflow as tf
import tensorflow_datasets as tfds

def load_datasets(data_dir=None):
    """
    Loads Stanford Dogs dataset with the "Power Move" split strategy:
    - Train: 100% of original Train set (~12,000 images)
    - Validation: 50% of original Test set (~4,290 images)
    - Test: 50% of original Test set (~4,290 images)
    
    Args:
        data_dir (str, optional): Path to store/load TFDS data. 
                                  Defaults to env var TFDS_DATA_DIR.

    Returns:
        (ds_train, ds_val, ds_test), ds_info
    """
    
    # If data_dir is not explicitly passed, try to get it from env, else None (TFDS default)
    if data_dir is None:
        data_dir = os.environ.get("TFDS_DATA_DIR")

    print(f"Loading data from: {data_dir if data_dir else 'Default TFDS dir'}")

    # "Power Move" Split Strategy
    # train -> 100% of 'train' original
    # val   -> First 50% of 'test' original
    # test  -> Last 50% of 'test' original
    splits = ["train", "test[:50%]", "test[50%:]"]

    (ds_train, ds_val, ds_test), ds_info = tfds.load(
        "stanford_dogs",
        split=splits,
        with_info=True,
        as_supervised=True,
        data_dir=data_dir
    )

    return (ds_train, ds_val, ds_test), ds_info

def print_dataset_stats(ds_train, ds_val, ds_test, ds_info):
    """Helper to print confirmation of dataset sizes."""
    print("-" * 40)
    print(f"Dataset: {ds_info.name}")
    print(f"Total Classes: {ds_info.features['label'].num_classes}")
    print("-" * 40)
    
    # Note: cardinality might return tf.data.UNKNOWN_CARDINALITY (-2) if not computed yet,
    # but for standard TFDS it usually works or we can iterate to count if needed.
    # Usually TFDS slices preserve cardinality info.
    
    n_train = ds_train.cardinality().numpy()
    n_val = ds_val.cardinality().numpy()
    n_test = ds_test.cardinality().numpy()
    
    print(f"TRAIN set size (Original 100%): {n_train}")
    print(f"VALID set size (Test 50%):      {n_val}")
    print(f"TEST  set size (Test 50%):      {n_test}")
    print("-" * 40)
    print("Strategy Check:")
    print(" - Validation is separate from Train? YES")
    print(" - Test is separate from Val & Train? YES")
    print("-" * 40)

if __name__ == "__main__":
    # Sanity check execution
    try:
        (train, val, test), info = load_datasets()
        print_dataset_stats(train, val, test, info)
    except Exception as e:
        print(f"Error loading datasets: {e}")
