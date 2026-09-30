/* Progressive enhancement only: never alters static code or runs highlighting. */
(function () {
  'use strict';
  var zh = document.documentElement.lang.toLowerCase().startsWith('zh');
  var labels = zh
    ? { copy: '复制', done: '已复制', failed: '复制失败，请手动选择代码' }
    : { copy: 'Copy code', done: 'Copied', failed: 'Copy failed; select code manually' };

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
    status.setAttribute('role', 'status');
    toolbar.appendChild(button);
    toolbar.appendChild(status);
    wrapper.insertBefore(toolbar, pre);
    button.addEventListener('click', async function () {
      button.disabled = true;
      status.textContent = '';
      try {
        if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(code.textContent);
        status.textContent = labels.done;
      } catch (_) {
        status.textContent = labels.failed;
      } finally {
        button.disabled = false;
      }
    });
  });
}());
