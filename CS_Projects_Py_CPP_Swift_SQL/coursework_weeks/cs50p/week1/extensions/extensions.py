def main():
    filename = input("File name: ").strip().lower()
    extension = ""
    if "." in filename:
        extension = filename.rsplit(".", 1)[1]

    if extension == "gif":
        mime = "image/gif"
    elif extension in {"jpg", "jpeg"}:
        mime = "image/jpeg"
    elif extension == "png":
        mime = "image/png"
    elif extension == "pdf":
        mime = "application/pdf"
    elif extension == "txt":
        mime = "text/plain"
    elif extension == "zip":
        mime = "application/zip"
    else:
        mime = "application/octet-stream"

    print(mime)


main()
