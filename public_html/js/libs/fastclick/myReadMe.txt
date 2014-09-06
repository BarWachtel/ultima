Github Repo:
https://github.com/ftlabs/fastclick#sthash.p3q4P4ct.dpuf

Add fastclick.js during production (add minified version for distributed)
	<script type='text/javascript' src='./js/libs/fastclick.js'></script>
	
Attach fastclick to document body on load
regular:
	window.addEventListener('load', function() {
		FastClick.attach(document.body);
	}, false);

with jQuery:
	$(function() {
		FastClick.attach(document.body);
	});
