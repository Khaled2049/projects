export const drawRect = (detection, ctx) => {
  detection.forEach((pred) => {
    const [x, y, width, height] = pred["bbox"];
    const text = pred["class"];

    const color = "green";
    ctx.strokeSylt = color;
    ctx.font = "18px Arial";
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.fillText(text, x, y);
    ctx.rect(x, y, width, height);
    ctx.stroke();
  });
};
