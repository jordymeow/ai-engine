// Previous: none
// Current: 0.0.3

// React & Vendor Libs
const { useState, useEffect, useMemo } = wp.element;

// NekoUI
import { NekoWrapper } from '@neko-ui';
import { postFetch } from '@neko-ui';

// AI Engine
import { apiUrl, restNonce } from '@app/settings';
import GenerateTitlesModal from './modals/GenerateTitles';

const PostsListTools = () => {
  const [post, setPost] = useState();

  useEffect(() => {
    document.querySelectorAll('.mwai-link-title').forEach(item => {
      const postId = item.getAttribute('data-id');
      const postTitle = item.getAttribute('data-title');
      item.addEventListener('click', () => { 
        setPost({ postId, postTitle });
      }, false);
    });
  }, [])

  const onTitleClick = async (title) => {
    const res = await postFetch(`${apiUrl}/update_post_title`, { json: { postId: post.postId, title }, nonce: restNonce });
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

  return (
    <NekoWrapper>
      <GenerateTitlesModal post={post} onTitleClick={onTitleClick} onClose={() => { setPost() }} />
    </NekoWrapper>
  );
};

export default PostsListTools;
