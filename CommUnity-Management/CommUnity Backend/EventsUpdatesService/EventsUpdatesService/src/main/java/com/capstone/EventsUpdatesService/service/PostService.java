package com.capstone.EventsUpdatesService.service;

import com.capstone.EventsUpdatesService.dto.postDtos.PostDto;
import com.capstone.EventsUpdatesService.model.Post;
import com.capstone.EventsUpdatesService.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    // Create a new post
    public PostDto createPost(PostDto postDto) {
        Post post = dtoToEntity(postDto);
        Post savedPost = postRepository.save(post);
        return entityToDto(savedPost);
    }

    // Get all posts
    public List<PostDto> getAllPosts() {
        List<Post> posts = postRepository.findAll();
        return posts.stream().map(this::entityToDto).collect(Collectors.toList());
    }

    // Get a post by ID
    public PostDto getPostById(long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with ID: " + postId));
        return entityToDto(post);
    }

    public List<PostDto> getPostsBySociety(long societyId) {
        List<Post> posts = postRepository.findAllBySocietyId(societyId);
        return posts.stream().map(this::entityToDto).collect(Collectors.toList());
    }

    // Update a post
    public PostDto updatePost(long postId, PostDto postDto) {
        Post existingPost = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with ID: " + postId));

        existingPost.setTitle(postDto.getTitle());
        existingPost.setContent(postDto.getContent());
        existingPost.setPostImage(postDto.getPostImage());
        existingPost.setLikeCount(postDto.getLikeCount());

        Post updatedPost = postRepository.save(existingPost);
        return entityToDto(updatedPost);
    }

    // Delete a post
    public void deletePost(long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with ID: " + postId));
        postRepository.delete(post);
    }

    // Convert DTO to entity
    private Post dtoToEntity(PostDto postDto) {
        Post post = new Post();
        post.setTitle(postDto.getTitle());
        post.setContent(postDto.getContent());
        post.setPostImage(postDto.getPostImage());
        post.setLikeCount(postDto.getLikeCount());
        post.setSocietyId(postDto.getSocietyId());
        return post;
    }

    // Convert entity to DTO
    private PostDto entityToDto(Post post) {
        PostDto postDto = new PostDto();
        postDto.setPostId(post.getPostId());
        postDto.setTitle(post.getTitle());
        postDto.setContent(post.getContent());
        postDto.setPostImage(post.getPostImage());
        postDto.setSocietyId(post.getSocietyId());
        postDto.setLikeCount(post.getLikeCount());
        return postDto;
    }
}