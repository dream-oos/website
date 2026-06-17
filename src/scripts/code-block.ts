const MAX_HEIGHT = 400;

const COPY_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
const CHECK_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
const ERROR_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.inset = '-9999px auto auto -9999px';
  document.body.append(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
}

function setIcon(button: HTMLElement, icon: string): void {
  button.innerHTML = icon;
}

export function enhanceCodeBlocks(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('.prose pre').forEach((pre) => {
    if (pre.parentElement?.classList.contains('code-block')) return;

    const code = pre.querySelector('code');
    const wrapper = document.createElement('div');
    const copyBtn = document.createElement('button');
    const toggleBtn = document.createElement('button');

    wrapper.className = 'code-block';

    copyBtn.className = 'code-copy-button';
    copyBtn.type = 'button';
    copyBtn.setAttribute('aria-label', '复制代码块内容');
    copyBtn.innerHTML = COPY_ICON;
    copyBtn.dataset.label = '复制';

    pre.before(wrapper);
    wrapper.append(pre, copyBtn);

    copyBtn.addEventListener('click', async () => {
      try {
        await copyText(code?.textContent ?? pre.textContent ?? '');
        setIcon(copyBtn, CHECK_ICON);
        window.setTimeout(() => setIcon(copyBtn, COPY_ICON), 1600);
      } catch {
        setIcon(copyBtn, ERROR_ICON);
        window.setTimeout(() => setIcon(copyBtn, COPY_ICON), 1600);
      }
    });

    if (pre.scrollHeight > MAX_HEIGHT) {
      pre.style.maxHeight = `${MAX_HEIGHT}px`;
      pre.style.overflow = 'hidden';

      const fade = document.createElement('div');
      fade.className = 'code-fade';

      toggleBtn.className = 'code-toggle';
      toggleBtn.type = 'button';
      toggleBtn.setAttribute('aria-label', '展开代码');
      toggleBtn.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';

      wrapper.append(fade, toggleBtn);

      toggleBtn.addEventListener('click', () => {
        const expanded = pre.dataset.expanded === 'true';
        if (expanded) {
          pre.style.maxHeight = `${MAX_HEIGHT}px`;
          pre.style.overflow = 'hidden';
          toggleBtn.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
          toggleBtn.setAttribute('aria-label', '展开代码');
          pre.dataset.expanded = 'false';
        } else {
          pre.style.maxHeight = `${pre.scrollHeight}px`;
          pre.style.overflow = 'visible';
          toggleBtn.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
          toggleBtn.setAttribute('aria-label', '收起代码');
          pre.dataset.expanded = 'true';
        }
      });
    }
  });
}
