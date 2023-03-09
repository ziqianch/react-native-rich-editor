import init from './QuillEditor';
import {
  Bridge,
  QuillInstanceToken,
  QuillResolversBuiltin,
  ReactNativeBridgeToken,
  RNResolversBuiltin,
  RNResolverTokenBuiltin,
} from '../utils';
import type Quill from 'quill';
import type { QuillOptionsStatic } from 'quill';

const isURL = (str: string) => {
  const reg = /^((http|https):\/\/)/;
  return reg.test(str);
};

const loadScripts = async (scriptList: string[] = []) => {
  const loadPromise: Promise<void>[] = [];
  scriptList.forEach((urlOrText) => {
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    if (isURL(urlOrText)) {
      script.setAttribute('src', urlOrText);
    } else {
      script.innerText = urlOrText;
    }
    loadPromise.push(
      new Promise<void>((revolve, reject) => {
        script.onload = () => revolve();
        script.onabort = () => reject();
      })
    );
    document.body.append(script);
  });
  await Promise.allSettled(loadPromise);
};

const loadCss = async (cssList: string[] = []) => {
  const loadPromise: Promise<void>[] = [];
  cssList.forEach((urlOrText) => {
    if (isURL(urlOrText)) {
      const link = document.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('href', urlOrText);
      loadPromise.push(
        new Promise<void>((revolve, reject) => {
          link.onload = () => revolve();
          link.onabort = () => reject();
        })
      );
      document.body.append(link);
    } else {
      const style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.innerText = urlOrText;
      loadPromise.push(
        new Promise<void>((revolve, reject) => {
          style.onload = () => revolve();
          style.onabort = () => reject();
        })
      );
      document.body.append(style);
    }
  });
  await Promise.allSettled(loadPromise);
};

const mountQuill = (options?: QuillOptionsStatic) => {
  const el = document.createElement('div');
  el.id = '$editor';
  window.document.body.append(el);
  const _Quill = (window as any).Quill as typeof Quill;
  const quill = new _Quill(el, options);
  (window as any)[QuillInstanceToken] = quill;
  return quill;
};

try {
  Bridge.setSender((data) =>
    (window as any).ReactNativeWebView.postMessage(data)
  );

  const reactNativeBridge = new Bridge<
    QuillResolversBuiltin,
    RNResolversBuiltin
  >();
  (window as any)[ReactNativeBridgeToken] = reactNativeBridge;

  reactNativeBridge
    .call(RNResolverTokenBuiltin.OnWebViewInit)
    .then(async (config) => {
      await loadScripts([config.quillScript]);
      await loadCss(config.cssList);
      const quill = mountQuill(config.quillOptions);
      init(quill, reactNativeBridge);
      loadScripts(config.scriptsList);
      reactNativeBridge.call(RNResolverTokenBuiltin.OnEditorReady);
    });
} catch (e: any) {
  const error = document.createElement('div');
  error.innerText = e.message;
  document.body.append(error);
}
