/* Progressive enhancement only: never alters static code or runs highlighting. */
(function () {
  'use strict';
  var zh = document.documentElement.lang.toLowerCase().startsWith('zh');
  var labels = zh
    ? { copy: '复制', done: '已复制', failed: '复制失败' }
    : { copy: 'Copy', done: 'Copied', failed: 'Copy failed' };

  document.querySelectorAll('.article .content pre > code').forEach(function (code) {
    var pre = code.parentNode;
    if (pre.parentNode.classList.contains('code-block')) return;
    var wrapper = document.createElement('div');
    wrapper.className = 'code-block';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);
    var toolbar = document.createElement('div');
    toolbar.className = 'code-toolbar';
    var button = document.createElement('button');
    button.type = 'button';
    button.textContent = labels.copy;
    var status = document.createElement('span');
    status.className = 'code-copy-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-atomic', 'true');
    toolbar.appendChild(button);
    toolbar.appendChild(status);
    wrapper.insertBefore(toolbar, pre);
    var resetTimer;
    button.addEventListener('click', async function () {
      clearTimeout(resetTimer);
      button.disabled = true;
      button.textContent = labels.copy;
      status.textContent = '';
      try {
        if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(code.textContent);
        button.textContent = labels.done;
        status.textContent = labels.done;
      } catch (_) {
        button.textContent = labels.failed;
        status.textContent = labels.failed;
      } finally {
        button.disabled = false;
        resetTimer = setTimeout(function () {
          button.textContent = labels.copy;
          status.textContent = '';
        }, 2000);
      }
    });
  });
}());
