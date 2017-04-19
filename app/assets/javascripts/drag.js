interact('.resize-drag').resizable({
  preserveAspectRatio: true,
  edges: { left: true, right: true }
}).on('resizemove', function (event) {
  var target = event.target;
  var next_target = event.target.nextElementSibling;
  var edges = 'r';
  var punch_direction = 'r';
  var new_next_target_width = null;

  if(event.dx <= 0) {
    punch_direction = 'l'
  }
  if(event.edges.left) {
    edges = 'l'
    next_target = event.target.previousElementSibling;
  }

  // Update next target width
  width = parseInt(target.style.width);
  move_diff = width - parseInt(event.rect.width);
  if(next_target) {
    next_target_width = parseInt(next_target.style.width);
    new_next_target_width = next_target_width + move_diff;
  }

  var index = $('.chord.resize-drag').index(target);
  punch = timeline.state.punches[index];
  if(punch) {
    if(edges == 'l') {
      punch.time = timeline.px_to_s(timeline.s_to_px(punch.time) + move_diff).toString();
      if(index == 0 && punch.time <= 0) {
        punch.time = 0;
      } else {
        if(next_target) {
          next_target.style.width  = new_next_target_width + 'px';
        }
        target.style.width  = event.rect.width + 'px';
        if(index == 0) {
          target.style.marginLeft = timeline.s_to_ems(punch.time) + 'em';
        }
      }
    } else if(edges == 'r') {
      if(punch_direction == 'r' && $('.chord.resize-drag').length == index + 1 ){
        next_time = timeline.px_to_s(timeline.s_to_px(punch.time) + event.rect.width).toString();
        if(next_time <= ytplayer._duration) {
          target.style.width  = event.rect.width + 'px';
        }
        adj_node = punch._next_node;
        if(adj_node) {
          adj_node.time = timeline.px_to_s(timeline.s_to_px(ytplayer._duration)).toString();
        }
      } else {
        if(next_target) {
          next_target.style.width  = new_next_target_width + 'px';
        }
        next_time = timeline.px_to_s(timeline.s_to_px(punch.time) + event.rect.width).toString();
        if(next_time <= ytplayer._duration) {
          target.style.width  = event.rect.width + 'px';
        }

        adj_node = punch._next_node;
        if(adj_node) {
          old_width = timeline.s_to_px(adj_node.time) - timeline.s_to_px(punch.time);
          difference = old_width - width
          adj_node.time = timeline.px_to_s(timeline.s_to_px(adj_node.time) - difference).toString();
        }
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