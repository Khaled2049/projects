export const removeHTMLtags = (str: String) => {
  return str.replace(/<[^>]*>?/gm, '');
};
