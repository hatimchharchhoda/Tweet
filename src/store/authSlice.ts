import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the type for the user object
export interface User {
  _id: string;
  username: string;
  email: string;
}

export interface Tweet {
  _id: string;
  text: string;
  timestamp: string;
  username: string; // Store the user who created the tweet
}

// Define the type for the state
export interface AuthState {
  status: boolean;
  userData: { user: User; expires: string } | null; // Structure matching the session object
  tweets: Tweet[];
}

const initialState: AuthState = {
  status: false,
  userData: null,
  tweets: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; expires: string }>) => {
      state.status = true;
      state.userData = action.payload;
      state.tweets = []; // Reset tweets on login
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
      state.tweets = []; // Clear tweets on logout
    },
    setTweets: (state, action: PayloadAction<Tweet[]>) => {
      if (state.userData) {
        // Filter tweets that belong to the logged-in user
        state.tweets = action.payload.filter(
          (tweet) => tweet.username === state.userData?.user._id
        );
      }
    },
    addTweet: (state, action: PayloadAction<Tweet>) => {
      if (state.userData && action.payload.username === state.userData.user._id) {
        state.tweets.push(action.payload);
      }
    },
  },
});

export const { login, logout, setTweets, addTweet } = authSlice.actions;

export default authSlice.reducer;

// Example usage in a component to add new tweet
// dispatch(addTweet({ 
//   _id: "tweet123", 
//   text: "Hello world!", 
//   timestamp: new Date().toISOString(), 
//   userId: loggedInUserId 
// }));

// Example usage in a component to set tweets
// dispatch(setTweets(allTweetsFromServer));
