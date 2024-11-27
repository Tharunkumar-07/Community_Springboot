package com.capstone.EventsUpdatesService.dto.postDtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostDto {
    private long postId;
    private String title;
    private String content;
    private String postImage;
    private long likeCount;

    private long societyId;
}