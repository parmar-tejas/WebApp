interact('.resize-drag')

.draggable({
  onmove: window.dragMoveListener
})

.resizable({
  preserveAspectRatio: true,
  edges: { left: true, right: true }
})

.on('resizemove', function (event) {
  var target = event.target,
      x = (parseFloat(target.getAttribute('data-x')) || 0),
      y = (parseFloat(target.getAttribute('data-y')) || 0);

  // update the element's style
  target.style.width  = event.rect.width + 'px';

  // translate when resizing from top or left edges
  x += event.deltaRect.left;
  // y += event.deltaRect.top;

  // target.style.webkitTransform = target.style.transform =
  //     'translate(' + x + 'px,' + y + 'px)';

  // target.setAttribute('data-x', x);
  // target.setAttribute('data-y', y);
  // target.textContent = Math.round(event.rect.width) + '×' + Math.round(event.rect.height);
});

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  $("div [id='" + data + "']").trigger('click');
}