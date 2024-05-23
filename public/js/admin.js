function cpuSectionCollapser() {
  var $cpuToggle = $('#cpu_toggle');
  var $cpuSection = $('#cpu_section');

  if ($cpuSection && $cpuToggle) {
    $cpuToggle.click(function() {
      $cpuSection.slideToggle();
      $cpuToggle.text(function(_, text) {
        return text === 'Show' ? 'Hide' : 'Show';
      });
    });
  }
}

$(document).ready(function() {
  cpuSectionCollapser();
});