export class Renderer {
  constructor(notes, topLeft) {
    this.notes = notes;
    this.topLeft = this.topLeft;
  }

  render(data) {

      switch (data) {
        case "info":
          console.log("info");
          break;
        case "alert":
          console.log("alert");
          break;
        case "radio":
          console.log("radio");
          break;
        case "checkbox":
          console.log("checkbox");
          break;
        default:
          console.log("unknown type:", item.type);
      }

  }
}
