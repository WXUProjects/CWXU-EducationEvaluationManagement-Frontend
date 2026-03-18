<template>
    <div class="NavBarContainer">
        <div class="items">
            <router-link to="/" class="item">
                <font-awesome-icon icon="fa-solid fa-home" class="icon" />
                <div class="title">首页</div>
            </router-link>
            <router-link to="/example" class="item">
                <font-awesome-icon icon="fa-solid fa-gear" class="icon" />
                <div class="title">示例页面</div>
            </router-link>
        </div>
        <div class="icon">
            <img src="/public/svg/无锡学院-reverse-logo.svg"></img>
        </div>
    </div>
</template>

<style scoped>
.NavBarContainer {
    height: 90%;
    position: fixed;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    padding: 5px;
    background-color: #6f2b75;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    border-radius: 24px;
    border: 10px solid #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    transition: box-shadow 0.1s ease-in-out;

    .items {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;

        .item {
            display: flex;
            width: 28px;
            height: 28px;
            padding: 10px;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            border-radius: 18px;
            gap: 4px;
            color: #fff;
            text-decoration: none;
            transform: scale(0.95);

            transition: color 0.1s ease-in-out, background-color 0.1s ease-in-out, box-shadow 0.1s ease-in-out, transform 0.1s ease-in-out;

            &:first-child {
                margin-top: 10px;
            }

            &:hover {
                color: #333;
                background-color: #eee;
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
                transform: scale(1);
            }

            &:hover .title {
                opacity: 1;
                transform: translateX(0px);
            }

            .icon {
                font-size: 18px;
            }

            .title {
                position: absolute;
                width: 30px;
                bottom: -20px;
                padding: 2px 5px;
                width: 100px;
                color: #fff;
                text-align: center;
                font-size: 12px;
                opacity: 0;

                transition: opacity 0.1s ease-in-out;
            }
        }
    }

    .icon{
        width: 50px;

        img{
            width: 100%;
        }
    }
}
</style>