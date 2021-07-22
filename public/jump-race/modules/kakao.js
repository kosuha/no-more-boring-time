// 카카오톡으로 공유하기
Kakao.init('b79548ecf35138c2947949e7c1739b54');

function inviteKakao() {
    Kakao.Link.sendDefault({
        objectType: "feed",
        content: {
            title: 'Jump Race',
            description: "Jump Race에 초대되었습니다.",
            imageUrl: "",
            link: {
                webUrl: "http://ec2-3-35-14-224.ap-northeast-2.compute.amazonaws.com/jump-race/?room=" + roomId,
                mobileWebUrl: "http://ec2-3-35-14-224.ap-northeast-2.compute.amazonaws.com/jump-race/?room=" + roomId,
                androidExecParams: "test",
            },
        },
        buttonTitle: "게임에 참가하기"
    });
}
