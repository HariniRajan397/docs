import React, { forwardRef, Ref, useState } from 'react';
import { LinkProps } from '@components/typography';
import { IconButton } from '@components/icon-button';
import { useColorMode } from '@common/hooks/use-color-mode';
import { Portal, Box, Fade } from '@stacks/ui';
import { DocSearchModal } from '@docsearch/react';
import Link from 'next/link';
import Router from 'next/router';
import search from 'algoliasearch';

// search()

const navigator = {
  navigate: async ({ suggestionUrl }: any) => {
    const url = getLocalUrl(suggestionUrl);
    return Router.push(url, url);
  },
};
const searchOptions = {
  apiKey: '9040ba6d60f5ecb36eafc26396288875',
  indexName: 'blockstack',
  navigator,
};

const getLocalUrl = href => {
  const _url = new URL(href);
  const url = href
    .replace(_url.origin, '')
    .replace('#__next', '')
    .replace('.html', '')
    .replace('storage/clidocs', 'core/cmdLineRef');
  return url;
};

function Hit({ hit, children }: any) {
  const url = getLocalUrl(hit.url);
  return (
    <Link href={url} as={url} passHref scroll={!url.includes('#')}>
      <a>{children}</a>
    </Link>
  );
}

export const SearchButton = forwardRef((props: LinkProps, ref: Ref<HTMLDivElement>) => {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const triggerAlgolia = () => setIsOpen(true);
  const [colorMode] = useColorMode();
  return (
    <>
      <Portal>
        <Fade in={isOpen}>
          {styles => (
            <Box position="absolute" zIndex={9999} style={styles} css={(theme: Theme) => css({
            '.DocSearch.DocSearch-Container':{
              position:'fixed',
              }
            })(theme)}>
              <DocSearchModal
                initialScrollY={window.scrollY}
                {...(searchOptions as any)}
                onClose={onClose}
                // hitComponent={Hit}
              />
            </Box>
          )}
        </Fade>
      </Portal>
      <IconButton onClick={triggerAlgolia} title="Search docs" {...props} ref={ref}>
        {/* {colorMode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />} */}
        Search
      </IconButton>
    </>
  );
});
