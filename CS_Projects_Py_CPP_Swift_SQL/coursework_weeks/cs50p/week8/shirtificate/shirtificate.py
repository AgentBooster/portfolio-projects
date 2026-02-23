from fpdf import FPDF # type: ignore


class PDF(FPDF):
    def header(self):
        self.set_font("helvetica", "B", 45)
        self.cell(0, 60, "CS50 Shirtificate", align="C")
        self.ln(20)


def main():
    name = input("Name: ")
    pdf = PDF()
    pdf.add_page(orientation="P", format="A4")

    pdf.image("shirtificate.png", x=10, y=70, w=190)

    pdf.set_font("helvetica", "B", 25)
    pdf.set_text_color(255, 255, 255)

    pdf.set_y(140)
    pdf.cell(0, 10, f"{name} took CS50", align="C")

    pdf.output("shirtificate.pdf")


if __name__ == "__main__":
    main()
