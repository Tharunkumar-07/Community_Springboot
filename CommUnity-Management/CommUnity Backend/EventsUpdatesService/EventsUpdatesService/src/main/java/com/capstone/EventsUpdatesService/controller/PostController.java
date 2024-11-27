package com.capstone.EventsUpdatesService.controller;

import com.capstone.EventsUpdatesService.dto.postDtos.PostDto;
import com.capstone.EventsUpdatesService.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/community/event-service/post")
public class PostController {

    @Autowired
    private PostService postService;

    // Create a new post
    @PostMapping("/create-post")
    public ResponseEntity<PostDto> createPost(@RequestBody PostDto postDto) {
        PostDto createdPost = postService.createPost(postDto);
        return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
    }

    // Get all posts
    @GetMapping("/get-posts")
    public ResponseEntity<List<PostDto>> getAllPosts() {
        List<PostDto> posts = postService.getAllPosts();
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    // Get a post by ID
    @GetMapping("/get-posts/{postId}")
    public ResponseEntity<PostDto> getPostById(@PathVariable long postId) {
        PostDto post = postService.getPostById(postId);
        return new ResponseEntity<>(post, HttpStatus.OK);
    }

    //Get the posts by societyId
    @GetMapping("/by-society/{societyId}")
    public ResponseEntity<List<PostDto>> getPostsBySociety(@PathVariable long societyId) {
        List<PostDto> posts = postService.getPostsBySociety(societyId);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    // Update a post
    @PutMapping("/update/{postId}")
    public ResponseEntity<PostDto> updatePost(@PathVariable long postId, @RequestBody PostDto postDto) {
        PostDto updatedPost = postService.updatePost(postId, postDto);
        return new ResponseEntity<>(updatedPost, HttpStatus.OK);
    }

    // Delete a post
    @DeleteMapping("/delete/{postId}")
    public ResponseEntity<String> deletePost(@PathVariable long postId) {
        postService.deletePost(postId);
        return new ResponseEntity<>("Post with ID: "+postId+" deleted successfully", HttpStatus.OK);
    }
}
