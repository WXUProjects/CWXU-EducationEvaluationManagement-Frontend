<template>
    <div class="footerContainer">
        <div class="content">
            <div class="title">无锡学院新西伯利亚学院教学评价管理平台</div>
            <div class="logo">
                <img src="/xiboliyaxueyuan.png" alt="">
            </div>
        </div>
    </div>
</template>
<style scoped>
.footerContainer {
    height: 100px;
    padding: 20px 50px 20px 100px;
    border-top: 3px solid #6f2b75;
    background: #fff;
    z-index: 99;

    .content {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .title {
            font-size: 16px;
        }

        .logo {
            height: 50px;
            img{
                user-select: none;
                height: 100%;
            }
        }
    }
}
</style>