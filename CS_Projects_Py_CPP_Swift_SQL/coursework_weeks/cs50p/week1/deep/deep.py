def main():
    answer = input("¿Cuál es la respuesta a la Gran Pregunta de la Vida, el Universo y Todo lo demás? ")
    normalized = " ".join(answer.strip().lower().replace("-", " ").split())
    if normalized == "42" or normalized == "forty two":
        print("Yes")
    else:
        print("No")


main()
