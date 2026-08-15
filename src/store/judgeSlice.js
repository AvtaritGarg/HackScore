import { createSlice } from "@reduxjs/toolkit";

const judgeSlice = createSlice({
  name: "judge",
  initialState: {
    judgeId: null,
  },
  reducers: {
    loginJudge: (state, action) => {
      state.judgeId = action.payload;
    },
    logoutJudge: (state) => {
      state.judgeId = null;
    },
  },
});

export const { loginJudge, logoutJudge } = judgeSlice.actions;
export default judgeSlice.reducer;
