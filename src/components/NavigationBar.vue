<template>
    <div class="NavBarContainer">
        <router-link to="/" class="item">
            <font-awesome-icon icon="fa-solid fa-home" class="icon" />
            <div class="title">首页</div>
        </router-link>
        <router-link to="/example" class="item">
            <font-awesome-icon icon="fa-solid fa-gear" class="icon" />
            <div class="title">示例页面</div>
        </router-link>
    </div>
</template>

<style scoped>
.NavBarContainer {
    padding: 10px;
    border-right: 1px solid #ddd;
    display: flex;
    flex-direction: column;
    align-items: center;

    .item {
        display: flex;
        width: 100%;
        padding: 10px;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        gap: 4px;
        color: #000;
        text-decoration: none;
        transition: color 0.1s ease-in-out, background-color 0.1s ease-in-out;

        &:hover {
            color: #333;
            background-color: #eee;
        }

        .icon {
            font-size: 18px;
        }

        .title {
            font-size: 16px;
        }
    }
}
</style>