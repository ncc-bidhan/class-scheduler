import { useEffect } from 'react';

const usePageTitle = (title: string) => {
  useEffect(() => {
    document.title = `ClassFlow | ${title}`;
  }, [title]);
};

export default usePageTitle;
