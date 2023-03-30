// Previous: 1.3.68
// Current: 1.3.90

// React & Vendor Libs
const { useState, useEffect, useMemo } = wp.element;

// NekoUI
import { NekoUI, NekoWrapper } from '@neko-ui';
import { nekoFetch } from '@neko-ui';

// AI Engine
import { apiUrl, restNonce } from '@app/settings';
import GenerateTitlesModal from './modals/GenerateTitles';
import GenerateExcerptsModal from './modals/GenerateExcerpts';

const PostsListTools = () => {
  const [post, setPost] = useState();

  useEffect(() => {
    document.querySelectorAll('.mwai-link-title').forEach(item => {
      const postId = item.getAttribute('data-id');
      const postTitle = item.getAttribute('data-title');
      item.addEventListener('click', () => { 
        setPost({ postId, postTitle, mode: 'title' });
      }, false);
    });
    document.querySelectorAll('.mwai-link-excerpt').forEach(item => {
      const postId = item.getAttribute('data-id');
      const postTitle = item.getAttribute('data-title');
      item.addEventListener('click', () => { 
        setPost({ postId, postTitle, mode: 'excerpt' });
      }, false);
    });
  }, [])

  const onTitleClick = async (title) => {
    const res = await nekoFetch(`${apiUrl}/update_post_title`, { 
      method: 'POST',
      nonce: restNonce,
      json: { 
        postId: post.postId,
        title
      }});
    if (!res.success) {
      throw new Error(res.message);
    }
    else {
      setPost();
      // Look for the element tr[id="post-123"] and update the title
      const tr = document.querySelector(`tr[id="post-${post.postId}"]`);
      if (tr) {
        const rowTitle = tr.querySelector('.row-title');
        if (rowTitle) {
          rowTitle.innerHTML = title;
        }
      }
      // Also update the element .hidden .post_title
      const hiddenTitle = tr.querySelector(`.hidden .post_title`);
      if (hiddenTitle) {
        hiddenTitle.innerHTML = title;
      }
    }
  }

  const onExcerptClick = async (excerpt) => {
    const res = await nekoFetch(`${apiUrl}/update_post_excerpt`, {
      method: 'POST',
      nonce: restNonce,
      json: {
        postId: post.postId,
        excerpt
      }});
    if (!res.success) {
      throw new Error(res.message);
    }
    else {
      setPost();
    }
  }

  return (
    <NekoUI>
      <NekoWrapper>
        <GenerateTitlesModal post={post?.mode === 'title' ? post : null} onTitleClick={onTitleClick}
          onClose={() => { setPost() }}
        />
        <GenerateExcerptsModal post={post?.mode === 'excerpt' ? post : null} onExcerptClick={onExcerptClick}
          onClose={() => { setPost() }}
        />
      </NekoWrapper>
    </NekoUI>
  );
};

export default PostsListTools;
