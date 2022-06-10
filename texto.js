class Texto {
  constructor() {
    this.texto = document.createElement("div");
    this.titulo = document.createElement("h1");
    this.subtitulo = document.createElement("h2");
    this.texto.style.position = "absolute";
    this.texto.style.top = "10px";
    this.texto.style.left = "50%";
    this.texto.style.transform = "translate(-50%,0%)";

    this.titulo.style.color = "#ffffff";
    this.subtitulo.style.color = "#ffffff";
    this.titulo.style.textAlign = "center";
    this.subtitulo.style.textAlign = "center";

    this.titulo.innerText = "Version v0.17";
    this.subtitulo.innerText = "espere";

    this.texto.append(this.titulo);
    this.texto.append(this.subtitulo);
    document.body.append(this.texto);
  }

  setTitulo(txt) {
    this.titulo.innerText = txt;
  }
  setSubtitulo(txt) {
    this.subtitulo.innerText = txt;
  }
}
export let texto = new Texto();
