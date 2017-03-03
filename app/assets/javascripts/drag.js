interact('.resize-drag').resizable({
  preserveAspectRatio: true,
  edges: { left: true, right: true }
}).on('resizemove', function (event) {
  console.log('Resize Move' + event.target.id);
  var target = event.target;
  var next_target = null;
  var edges = 'r';

  if(event.deltaRect.left > 0 || event.deltaRect.left < 0) {
    next_target = event.target.previousElementSibling;
    edges = 'l';
  } else {
    next_target = event.target.nextElementSibling;
  }

  // Update next target width
  width = parseInt(target.style.width);
  move_diff = width - parseInt(event.rect.width);
  if(next_target) {
    next_target_width = parseInt(next_target.style.width);
    new_next_target_width = next_target_width + move_diff;
    next_target.style.width  = new_next_target_width + 'px';
  }

  // update the element's style
  target.style.width  = event.rect.width + 'px';

  var index = $('.chord').index(target);
  punch = timeline.state.punches[index];
  if(punch) {
    if(edges == 'l') {
      punch.time = timeline.px_to_s(timeline.s_to_px(punch.time) + move_diff).toString();
    } else {
      adj_node = punch._next_node;
      if(adj_node) {
        old_width = timeline.s_to_px(adj_node.time) - timeline.s_to_px(punch.time);
        difference = old_width - width
        adj_node.time = timeline.px_to_s(timeline.s_to_px(adj_node.time) - difference).toString();
      }
    }
  }
}).on('resizeend', function(event) {
  timeline.render();
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