import React, { useRef, useCallback, useState, useEffect } from 'react';
import {
  TextBolderIcon, TextAUnderlineIcon, TextItalicIcon,
  AlignLeftIcon, AlignCenterHorizontalIcon, AlignRightIcon,
  LinkIcon, ListIcon, ListNumbersIcon, QuotesIcon, CodeIcon,
  ArrowCounterClockwiseIcon, ArrowClockwiseIcon, ImageSquareIcon, XIcon
} from '@phosphor-icons/react';
import clsx from 'clsx';

export const RichTextField = ({
  label = "Content",
  value = "",
  onChange,
  required = false,
  onUpload,           // async (file) => public URL
  maxInlineMB = 1.2,  // if no onUpload, fallback to DataURL up to this size
}) => {
  const editorRef = useRef(null);
  const fileRef = useRef(null);
  const savedRange = useRef(null);

  // --- image selection + resize overlay ---
  const wrapRef = useRef(null);
  const [selImg, setSelImg] = useState(null);
  const [overlayRect, setOverlayRect] = useState(null);
  const [drag, setDrag] = useState(null); // {startX, startW}

  const [uploading, setUploading] = useState(false);

  const emit = useCallback(() => {
    if (!onChange || !editorRef.current) return;
    onChange({ target: { value: editorRef.current.innerHTML } });
  }, [onChange]);

  useEffect(() => {
    // keep selection range for toolbar actions
    const onSel = () => {
      const sel = document.getSelection();
      if (sel && sel.rangeCount) savedRange.current = sel.getRangeAt(0).cloneRange();
    };
    document.addEventListener('selectionchange', onSel);
    return () => document.removeEventListener('selectionchange', onSel);
  }, []);

  useEffect(() => {
    // keep editor DOM in sync with controlled value
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const restore = () => {
    const sel = window.getSelection();
    if (savedRange.current && sel) {
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
  };

  const focusEditor = () => editorRef.current?.focus();

  const exec = useCallback((cmd, v = null) => {
    restore();
    document.execCommand(cmd, false, v);
    focusEditor();
    emit();
  }, [emit]);

  const handleKeyDown = useCallback((e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b': e.preventDefault(); exec('bold'); break;
        case 'i': e.preventDefault(); exec('italic'); break;
        case 'u': e.preventDefault(); exec('underline'); break;
        case 'z': e.preventDefault(); exec(e.shiftKey ? 'redo' : 'undo'); break;
        default: break;
      }
    }
    // delete selected image via keyboard
    if ((e.key === 'Backspace' || e.key === 'Delete') && selImg) {
      e.preventDefault();
      selImg.remove();
      setSelImg(null);
      setOverlayRect(null);
      emit();
    }
  }, [exec, selImg, emit]);

  // --- image insert helpers ---
  const addLink = () => {
    restore();
    const url = window.prompt('Enter URL (https://…)');
    if (!url) return;
    try {
      const u = new URL(url);
      if (!/^https?:$/.test(u.protocol)) return;
      exec('createLink', u.href);
    } catch { }
  };

  const insertImgElAlt = (src, alt) => {
    exec('insertImage', src);
    const imgs = editorRef.current?.getElementsByTagName('img') || [];
    for (let i = imgs.length - 1; i >= 0; i--) {
      if (imgs[i].getAttribute('src') === src) {
        if (alt) imgs[i].setAttribute('alt', alt);
        // default responsive behaviour
        imgs[i].removeAttribute('height');
        imgs[i].style.height = 'auto';
        imgs[i].style.maxWidth = '100%';
        // select it
        setTimeout(() => selectImage(imgs[i]), 0);
        break;
      }
    }
  };

  const insertImageFromUrl = async () => {
    restore();
    const url = window.prompt('Image URL (https://…)');
    if (!url) return;
    try {
      const u = new URL(url);
      if (!/^https?:$/.test(u.protocol)) return;
      const alt = window.prompt('Alt text (optional)') || '';
      insertImgElAlt(u.href, alt);
    } catch { }
  };

  const toDataURL = (file) =>
    new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onerror = () => reject(new Error('read fail'));
      r.onload = () => resolve(r.result);
      r.readAsDataURL(file);
    });

  const onUploadClick = () => { restore(); fileRef.current?.click(); };

  const onFileChange = async (e) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f || !f.type.startsWith('image/')) return;
    setUploading(true);
    try {
      let url = '';
      if (typeof onUpload === 'function') {
        url = await onUpload(f);
      } else {
        if (f.size > maxInlineMB * 1024 * 1024) {
          alert(`Image > ${maxInlineMB}MB. Please use a smaller image or a URL.`);
          setUploading(false);
          return;
        }
        url = await toDataURL(f);
      }
      const alt = window.prompt('Alt text (optional)') || '';
      insertImgElAlt(url, alt);
    } catch {
      alert('Could not insert image.');
    } finally {
      setUploading(false);
      focusEditor();
      emit();
    }
  };

  // --- selection + overlay positioning ---
  const updateOverlay = useCallback((imgEl) => {
    if (!imgEl || !wrapRef.current) { setOverlayRect(null); return; }
    const imgBox = imgEl.getBoundingClientRect();
    const wrapBox = wrapRef.current.getBoundingClientRect();
    setOverlayRect({
      top: imgBox.top - wrapBox.top + wrapRef.current.scrollTop,
      left: imgBox.left - wrapBox.left + wrapRef.current.scrollLeft,
      width: imgBox.width,
      height: imgBox.height,
    });
  }, []);

  const selectImage = (imgEl) => {
    setSelImg(imgEl);
    updateOverlay(imgEl);
  };

  const clearSelection = () => {
    setSelImg(null);
    setOverlayRect(null);
  };

  useEffect(() => {
    const onClick = (e) => {
      if (!editorRef.current) return;
      if (e.target && e.target.tagName === 'IMG' && editorRef.current.contains(e.target)) {
        selectImage(e.target);
      } else if (!wrapRef.current?.contains(e.target)) {
        clearSelection();
      }
    };
    const onScrollOrResize = () => { if (selImg) updateOverlay(selImg); };
    document.addEventListener('click', onClick);
    window.addEventListener('resize', onScrollOrResize);
    wrapRef.current?.addEventListener('scroll', onScrollOrResize);
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('resize', onScrollOrResize);
      wrapRef.current?.removeEventListener('scroll', onScrollOrResize);
    };
  }, [selImg, updateOverlay]);

  // --- dragging to resize ---
  const startDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selImg) return;

    const startW = selImg.getBoundingClientRect().width;
    const startX = 'clientX' in e ? e.clientX : 0;

    // Max width = nearest block container (or editor wrap) width
    const block = selImg.closest('figure, p, div, li') || wrapRef.current;
    const maxW = block ? block.getBoundingClientRect().width : startW;

    const state = { startX, startW, maxW };
    setDrag(state);

    // Prefer Pointer Events
    if (e.nativeEvent && 'pointerId' in e.nativeEvent && e.currentTarget.setPointerCapture) {
      const id = e.nativeEvent.pointerId;
      e.currentTarget.setPointerCapture(id);

      const onMove = (pe) => {
        const dx = pe.clientX - state.startX;
        const newW = Math.max(60, Math.min(Math.round(state.startW + dx), Math.round(state.maxW)));
        selImg.style.width = newW + 'px';
        selImg.removeAttribute('height');
        selImg.setAttribute('width', String(newW));
        updateOverlay(selImg);
      };
      const onUp = () => {
        try { e.currentTarget.releasePointerCapture(id); } catch (_) { }
        e.currentTarget.removeEventListener('pointermove', onMove);
        e.currentTarget.removeEventListener('pointerup', onUp);
        setDrag(null);
        emit();
      };

      e.currentTarget.addEventListener('pointermove', onMove);
      e.currentTarget.addEventListener('pointerup', onUp, { once: true });
      return;
    }

    // Fallback: mouse events
    const onMouseMove = (me) => {
      const dx = me.clientX - state.startX;
      const newW = Math.max(60, Math.min(Math.round(state.startW + dx), Math.round(state.maxW)));
      selImg.style.width = newW + 'px';
      selImg.removeAttribute('height');
      selImg.setAttribute('width', String(newW));
      updateOverlay(selImg);
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      setDrag(null);
      emit();
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp, { once: true });
  };

  const Btn = ({ title, onClick, children, disabled }) => (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={clsx(
        "px-2 py-1.5 rounded-md border Blueprint-label-medium transition",
        "border-schemesOutlineVariant text-schemesOnSurfaceVariant hover:text-schemesOnSurface hover:bg-surfaceContainerHigh",
        "focus:outline-none focus:ring-2 focus:ring-schemesPrimaryContainer disabled:opacity-50"
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="w-full">
      <div className="relative w-full rounded-lg border border-schemesOutline bg-schemesSurfaceContainerLow focus-within:border-schemesPrimaryContainer">
        <span className="absolute left-4 -translate-y-1/2 px-1 Blueprint-label-medium bg-schemesPrimaryFixed rounded-sm">
          {label}{required ? " *" : ""}
        </span>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 px-3 pt-6 pb-2 border-b border-schemesOutlineVariant">
          <Btn title="Bold (Ctrl+B)" onClick={() => exec('bold')}><TextBolderIcon size={18} /></Btn>
          <Btn title="Italic (Ctrl+I)" onClick={() => exec('italic')}><TextItalicIcon size={18} /></Btn>
          <Btn title="Underline (Ctrl+U)" onClick={() => exec('underline')}><TextAUnderlineIcon size={18} /></Btn>

          <div className="w-px h-6 bg-schemesOutlineVariant mx-1" />

          <Btn title="Align left" onClick={() => exec('justifyLeft')}><AlignLeftIcon size={18} /></Btn>
          <Btn title="Align center" onClick={() => exec('justifyCenter')}><AlignCenterHorizontalIcon size={18} /></Btn>
          <Btn title="Align right" onClick={() => exec('justifyRight')}><AlignRightIcon size={18} /></Btn>

          <div className="w-px h-6 bg-schemesOutlineVariant mx-1" />

          <Btn title="Bulleted list" onClick={() => exec('insertUnorderedList')}><ListIcon size={18} /></Btn>
          <Btn title="Numbered list" onClick={() => exec('insertOrderedList')}><ListNumbersIcon size={18} /></Btn>

          <div className="w-px h-6 bg-schemesOutlineVariant mx-1" />

          <Btn title="Quote" onClick={() => exec('formatBlock', 'blockquote')}><QuotesIcon size={18} /></Btn>
          <Btn title="Code block" onClick={() => exec('formatBlock', 'pre')}><CodeIcon size={18} /></Btn>
          <Btn title="Insert link" onClick={addLink}><LinkIcon size={18} /></Btn>

          <div className="w-px h-6 bg-schemesOutlineVariant mx-1" />

          <Btn title="Insert image URL" onClick={insertImageFromUrl}><ImageSquareIcon size={18} /></Btn>
          <Btn title={uploading ? "Uploading…" : "Upload image"} onClick={onUploadClick} disabled={uploading}>
            <span className="text-xs font-semibold px-1">{uploading ? "…" : "Upload"}</span>
          </Btn>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
        </div>

        {/* Editor area + resize overlay */}
        <div ref={wrapRef} className="relative">
          <div
            ref={editorRef}
            contentEditable
            onKeyDown={handleKeyDown}
            onInput={emit}
            className="min-h-[300px] px-3 py-3 outline-none Blueprint-body-medium text-schemesOnSurface
                       [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1
                       [&_img]:max-w-full [&_img]:h-auto [&_img]:my-2"
            suppressContentEditableWarning
          />

          {selImg && overlayRect && (
            <div
              className="absolute border border-schemesPrimaryContainer rounded"
              style={{
                top: overlayRect.top,
                left: overlayRect.left,
                width: overlayRect.width,
                height: overlayRect.height,
              }}
            >
              {/* remove selection button */}
              <button
                type="button"
                className="pointer-events-auto absolute -top-3 -right-3 rounded-full bg-schemesError text-schemesOnError p-1 shadow-md"
                title="Remove image"
                onClick={(e) => { e.stopPropagation(); selImg.remove(); clearSelection(); emit(); }}
              >
                <XIcon size={14} />
              </button>

              {/* resize handle bottom-right */}
              <div
                role="slider"
                aria-label="Resize image"
                className="pointer-events-auto absolute -bottom-2 -right-2 w-4 h-4 bg-schemesPrimaryContainer rounded-sm cursor-se-resize shadow"
                onMouseDown={startDrag}
                title="Drag to resize"
              />
            </div>
          )}
        </div>
      </div>

      <p className="mt-1 ml-1 Blueprint-body-small text-schemesOnSurfaceVariant">
        Tip: click an image to select it, then drag the corner to resize. Width is saved; height stays auto.
      </p>
    </div>
  );
};
