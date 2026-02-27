export const useFullscreen = () => {
  const enter = () => document.documentElement.requestFullscreen();
  const exit = () => document.exitFullscreen();
  return { enter, exit };
};