interact('.resize-drag').resizable({
  preserveAspectRatio: true,
  edges: { left: true, right: true }
}).on('resizestart', function(event) {
  // var next_target = null;
  // if(event.dx > 0) {
  //   next_target = event.target.previousElementSibling;
  // } else {
  //   next_target = event.target.nextElementSibling;
  // }
}).on('resizemove', function (event) {
  var target = event.target;
  var next_target = event.target.nextElementSibling;

  // Update Next target width
  target_width = parseInt(target.style.width);
  move_diff = target_width - parseInt(event.rect.width);
  if(next_target) {
    next_target_width = parseInt(next_target.style.width);
    new_next_target_width = next_target_width + move_diff;
    next_target.style.width  = new_next_target_width + 'px';
  }

  // update the element's style
  target.style.width  = event.rect.width + 'px';
}).on('resizeend', function(event) {
  var index = $('.chord').index(event.target);
  var width = parseFloat(event.target.style.width);
  timeline.resize_chord_width(index, width);
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