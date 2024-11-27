import React from "react";
import { useState } from "react";
import SideNavbar from "../SideNavbar";
import TopNavbar from "../TopNavbar";
import { HiPlusCircle } from "react-icons/hi2";
import { MdClose } from "react-icons/md";
import Cookies from "js-cookie";
import { RotatingLines } from "react-loader-spinner";
import { useEffect } from "react";
import Card from "../Card";
import "./index.css";
import "../NoticePage/index.css";

// Dummy data for posts
// const posts = [
//   {
//     id: 1,
//     title: "Community Gathering",
//     description:
//       "Join us for a community gathering at the central park. There will be games, food, and fun activities for all ages!",
//     date: "05/10/23",
//     time: "10:00 am",
//     image:
//       "https://res.cloudinary.com/digbzwlfx/image/upload/v1724995144/Rectangle_44_armnls.png",
//   },
//   {
//     id: 2,
//     title: "Fitness Workshop",
//     description:
//       "We are organizing a fitness workshop with professional trainers. Come and learn about healthy living and exercise routines.",
//     date: "12/11/23",
//     time: "09:00 am",
//     image:
//       "https://res.cloudinary.com/digbzwlfx/image/upload/v1724995136/Rectangle_44_1_om1bki.png",
//   },
//   {
//     id: 3,
//     title: "Book Club Meeting",
//     description:
//       "The book club will meet to discuss this month's book. Feel free to join and share your thoughts.",
//     date: "21/11/23",
//     time: "05:30 pm",
//     image:
//       "https://res.cloudinary.com/digbzwlfx/image/upload/v1724995129/Rectangle_44_2_v3crvp.png",
//   },
// ];
const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const PostsMainPage = () => {
  const [posts, setPosts] = useState([]);
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [showModal, setShowModal] = useState(false);
  const [newPostName, setNewPostName] = useState("");

  const [newPostDescription, setNewPostDescription] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);
  const [postFormattedData, setPostFormattedData] = useState([]);
  const [newPostImagePreview, setNewPostImagePreview] = useState(null);

  // Edit state
  const [editPostId, setEditPostId] = useState(null);
  const [editPostName, setEditPostName] = useState("");

  const [editPostDescription, setEditPostDescription] = useState("");
  const [editPostImage, setEditPostImage] = useState(null);
  const [editPostImagePreview, setEditPostImagePreview] = useState(null);

  const toggleModal = () => {
    setShowModal((prevShowModal) => !prevShowModal);
  };

  const fetchPosts = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    const jwtToken = Cookies.get("jwt_token");
    const data = JSON.parse(localStorage.getItem("data"));
    const { id } = data;

    try {
      const response = await fetch(
        `http://localhost:9999/api/community/event-service/post/by-society/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.ok) {
        const PostsData = await response.json();
        console.log("notices", PostsData);

        // Format the notices data as needed
        const formattedNotices = PostsData.map((notice) => ({
          id: notice.postId,
          title: notice.title,
          description: notice.content,
          image: notice.postImage,
          likeCount: notice.likeCount,
        }));

        setPosts(formattedNotices);

        setApiStatus(apiStatusConstants.success);
      } else {
        setApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      console.error("Error fetching notices:", error);
      setApiStatus(apiStatusConstants.failure);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file); // Append the file
    formData.append("upload_preset", "nd6vm7fo"); // Append the preset

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/digbzwlfx/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        setApiStatus(apiStatusConstants.failure);
      }

      const result = await response.json();
      await fetchPosts();
      return result.url; // Return the uploaded image URL
    } catch (error) {
      setApiStatus(apiStatusConstants.failure);
      alert("There was a problem with the image upload.");
    }
  };

  const handleAddPost = async () => {
    const jwtToken = Cookies.get("jwt_token");

    if (!newPostImage) {
      alert("Please select an image to upload.");
      return;
    }

    try {
      const imageUrl = await handleImageUpload(newPostImage);
      if (!imageUrl) {
        alert("Failed to upload image.");
        return;
      }

      const data = JSON.parse(localStorage.getItem("data"));

      const newNotice = {
        title: newPostName,
        content: newPostDescription,
        postImage: imageUrl,
        societyId: data.id, // Assuming `societyId` is the societyId
      };

      const createNoticeResponse = await fetch(
        "http://localhost:9999/api/community/event-service/post/create-post",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(newNotice),
        }
      );

      if (createNoticeResponse.ok) {
        console.log("Notice created successfully");
        setNewPostName("");
        setNewPostDescription("");
        setNewPostImage(null);
        setNewPostImagePreview(null);
        toggleModal();
      } else {
        setApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      setApiStatus(apiStatusConstants.failure);
      console.error("Error creating notice:", error);
    }
  };

  const handleEditPost = async () => {
    const data = JSON.parse(localStorage.getItem("data"));
    if (!editPostImage && !editPostImagePreview) {
      alert("Please select an image to upload.");
      return;
    }

    const jwtToken = Cookies.get("jwt_token");

    try {
      const imageUrl = editPostImage
        ? await handleImageUpload(editPostImage)
        : editPostImagePreview; // Use existing image if no new image

      const updatedNotice = {
        postId: editPostId,
        heading: editPostName,
        content: editPostDescription,
        noticeImage: imageUrl || "", // Use existing image URL if no new image is uploaded
        societyId: data.id, // Assuming `societyId` is the societyId
      };

      const response = await fetch(
        `http://localhost:9999/api/community/event-service/post/update/${editPostId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(updatedNotice),
        }
      );

      if (response.ok) {
        console.log("Notice updated successfully");
        setEditPostId(null);
        setEditPostName("");
        setEditPostDescription("");
        setEditPostImage(null);
        setEditPostImagePreview(null);
        toggleModal();
        fetchPosts();
      } else {
        console.error("Failed to update the notice");
        setApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      console.error("Error updating notice:", error);
      setApiStatus(apiStatusConstants.failure);
    }
  };

  const handleDeletePost = async (noticeId) => {
    const jwtToken = Cookies.get("jwt_token");

    try {
      const response = await fetch(
        `http://localhost:9999/api/community/event-service/post/delete/${noticeId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.ok) {
        console.log("Event deleted successfully");
        fetchPosts(); // Refresh the event list
      } else {
        console.error("Failed to delete event");
        setApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      setApiStatus(apiStatusConstants.failure);
    }
  };
  const handleEditButtonClick = (notice) => {
    setEditPostId(notice.id);
    setEditPostName(notice.title);
    setEditPostDescription(notice.description);
    setEditPostImagePreview(notice.image);
    toggleModal();
  };

  const renderFailureView = () => (
    <div className="error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="failure"
        className="failure-img"
      />
      <h1 className="failure-heading-text">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  );

  const renderLoadingView = () => (
    <div className="loader-container">
      <RotatingLines
        visible={true}
        height="96"
        width="96"
        color="#1a4258"
        strokeWidth="5"
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
      />
    </div>
  );

  const renderSuccessView = () => {
    const role = Cookies.get("role");
    return (
      <div className="apartment-right-main-sec">
        <div className="notice-board">
          {role === "ADMIN" && (
            <button className="add-notice-btn" onClick={toggleModal}>
              <span>
                <HiPlusCircle />
              </span>{" "}
              Create Post
            </button>
          )}

          {showModal && (
            <div className="modal-overlay" onClick={toggleModal}>
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <button className="close-btn" onClick={toggleModal}>
                  <MdClose />
                </button>
                <div className="modal">
                  <p className="head4 n-no-space">
                    {editPostId ? "Edit Post" : "Add Post"}
                  </p>
                  <div className="notice-form">
                    <div className="notice-upper-sec">
                      <div className="n-img-upload">
                        {editPostImagePreview ? (
                          <img
                            src={editPostImagePreview || newPostImagePreview}
                            alt="Preview"
                            className="image-preview"
                          />
                        ) : (
                          <span>
                            <HiPlusCircle /> Add Image
                          </span>
                        )}
                        <input
                          type="file"
                          id="image"
                          name="image"
                          accept="image/*"
                          className="n-img-up-in"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (editPostId) {
                              setEditPostImagePreview(e.target.result);
                              setEditPostImage(file);
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                setEditPostImagePreview(e.target.result);
                              };
                              reader.readAsDataURL(file);
                            } else {
                              setNewPostImage(file);
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                setEditPostImagePreview(e.target.result);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                      <div className="right-sec">
                        <input
                          type="text"
                          id="title"
                          name="title"
                          className="n-inp extra"
                          placeholder="Enter the post here..."
                          value={editPostId ? editPostName : newPostName}
                          onChange={(e) => {
                            if (editPostId) {
                              setEditPostName(e.target.value);
                            } else {
                              setNewPostName(e.target.value);
                            }
                          }}
                        />
                        {/* <input
                      type="datetime-local"
                      id="date"
                      name="date"
                      className="n-inp extra"
                      value={
                        editNoticeId
                          ? formatDateTime(editNoticeDate)
                          : formatDateTime(newNoticeDate)
                      }
                      onChange={(e) => {
                        if (editNoticeId) {
                          setEditNoticeDate(e.target.value);
                        } else {
                          setNewNoticeDate(e.target.value);
                        }
                      }}
                    /> */}
                      </div>
                    </div>
                    <textarea
                      className="n-textarea"
                      placeholder="Enter the description here..."
                      rows={5}
                      value={
                        editPostId ? editPostDescription : newPostDescription
                      }
                      onChange={(e) => {
                        if (editPostId) {
                          setEditPostDescription(e.target.value);
                        } else {
                          setNewPostDescription(e.target.value);
                        }
                      }}
                    />
                    <button
                      className="login-submit-button no-space right-align"
                      onClick={editPostId ? handleEditPost : handleAddPost}
                    >
                      {editPostId ? "Save Changes" : "Add Notice"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <h2 className="notice-title big">Posts</h2>
          <div className="posts-list">
            {posts.map((post) => (
              <Card
                key={post.id}
                id={post.id}
                image={post.image}
                title={post.title}
                description={post.description}
                date={post.date}
                time={post.time}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
                type="posts"
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const getView = () => {
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return renderLoadingView();
      case apiStatusConstants.success:
        return renderSuccessView();
      case apiStatusConstants.failure:
        return renderFailureView();
      default:
        return null;
    }
  };

  return (
    <div className="apartment-container">
      <SideNavbar />
      <div className="apartment-right-sec">
        <TopNavbar heading="Posts" />
        {getView()}
      </div>
    </div>
  );
};

export default PostsMainPage;
