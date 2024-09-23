import User from "../models/user.js"
const userController = {}

userController.saveUser = async (userName, sid) => {
  // 재방문 유저인지 확인
  let user = await User.findOne({ name: userName })
  // 없을 시 새로운 유저 정보 생성
  console.log('userName', userName)
  if (!user) {
    user = new User({
      name: userName,
      token: sid,
      online: true,
    });
  }
  // 기존 유저인 경우 token값만 변경
  user.token = sid;
  user.online = true;

  const result =await user.save();
  console.log('result', result)
  return user;
};

userController.checkUser = async (sid) => {
  const user = await User.findOne({ token: sid });
  if (!user) throw new Error("user not found");
  return user;
}

export default userController;