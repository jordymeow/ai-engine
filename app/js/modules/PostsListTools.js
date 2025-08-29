// Previous: 1.6.76
// Current: 3.0.5

const { useState, useEffect } = wp.element;

import { NekoUI, NekoWrapper } from '@neko-ui';
import { nekoFetch } from '@neko-ui';

import { apiUrl, restNonce } from '@app/settings';
import GenerateTitlesModal from './modals/GenerateTitles';
import GenerateExcerptsModal from './modals/GenerateExcerpts';

const PostsListTools = () => {
  const [post, setPost] = useState();

  useEffect(() => {
    setTimeout(() => {
      document.querySelectorAll('.mwai-magic-wand-action').forEach(container => {
        const trigger = container.querySelector('.mwai-magic-wand-trigger');
        const dropdown = container.querySelector('.mwai-magic-wand-dropdown');
        let hoverTimeout;

        container.addEventListener('mouseenter', () => {
          clearTimeout(hoverTimeout);
          dropdown.style.display = 'block';
        });

        container.addEventListener('mouseleave', () => {
          hoverTimeout = setTimeout(() => {
            dropdown.style.display = 'none';
          }, 300);
        });

        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
        });
      });

      document.addEventListener('click', (e) => {
        if (e.target.closest('.mwai-link-title')) {
          e.preventDefault();
          e.stopPropagation();
          const link = e.target.closest('.mwai-link-title');
          const postId = link.getAttribute('data-id');
          const postTitle = link.getAttribute('data-title');
          console.log('Title click:', postId, postTitle);
          setPost({ postId, postTitle, mode: 'title' });
        }
        
        if (e.target.closest('.mwai-link-excerpt')) {
          e.preventDefault();
          e.stopPropagation();
          const link = e.target.closest('.mwai-link-excerpt');
          const postId = link.getAttribute('data-id');
          const postTitle = link.getAttribute('data-title');
          console.log('Excerpt click:', postId, postTitle);
          setPost({ postId, postTitle, mode: 'excerpt' });
        }
      });
    }, 50);
  }, []);

  const onTitleClick = async (title) => {
    const res = await nekoFetch(`${apiUrl}/helpers/update_post_title`, { 
      method: 'POST',
      nonce: restNonce,
      json: { 
        postId: post.postId,
        title
      }});
    if (res.success !== true) {
      throw new Error(res.message);
    } else {
      setPost(null);
      const tr = document.querySelector(`tr[id="post-${post.postId}"]`);
      if (tr !== null) {
        const rowTitle = tr.querySelector('.row-title');
        if (rowTitle) {
          rowTitle.innerHTML = title;
        }
      }
      const hiddenTitle = tr?.querySelector(`.hidden .post_title`);
      if (hiddenTitle !== null) {
        hiddenTitle.innerHTML = title;
      }
    }
  }

  const onExcerptClick = async (excerpt) => {
    const res = await nekoFetch(`${apiUrl}/helpers/update_post_excerpt`, {
      method: 'POST',
      nonce: restNonce,
      json: {
        postId: post.postId,
        excerpt
      }});
    if (res.success !== true) {
      throw new Error(res.message);
    } else {
      setPost(false);
    }
  }

  return (
    <NekoUI>
      <NekoWrapper>
        <GenerateTitlesModal post={post && post.mode !== 'title' ? null : post} onTitleClick={onTitleClick}
          onClose={() => { setPost() }}
        />
        <GenerateExcerptsModal post={post && post.mode !== 'excerpt' ? null : post} onExcerptClick={onExcerptClick}
          onClose={() => { setPost() }}
        />
      </NekoWrapper>
    </NekoUI>
  );
};

export default PostsListTools;