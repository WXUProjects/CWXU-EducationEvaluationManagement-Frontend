<template>
    <div class="HomeContainer">
        <div class="dashboard">
            <div class="cards">
                <div class="card">
                    <div class="icon">
                        <font-awesome-icon icon="fa-solid fa-list-check" class="icon" />
                    </div>
                    <div class="info">
                        <div class="title">评教任务</div>
                        <div class="content">
                            <div class="item"><span>1</span>个评教任务进行中</div>
                            <div class="item"><span>1</span>个评教任务已结束</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.HomeContainer {
    display: flex;
    flex-direction: column;
    padding: 20px 0;

    .dashboard {
        display: flex;
        flex-direction: column;

        .cards {
            display: grid;

            .card {
                width: 300px;
                height: 100px;
                padding: 10px;
                display: flex;
                flex-direction: row;
                gap: 10px;
                border: 1px solid #6f2b75;
                border-left: 5px solid #6f2b75;
                background-color: #fff;

                .icon {
                    display: flex;
                    align-items: center;
                    font-size: 30px;
                }

                .info {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;

                    .title {
                        font-size: 20px;
                        font-weight: bold;
                    }

                    .content {
                        display: flex;
                        flex-direction: column;

                        .item {
                            span {
                                font-weight: bold;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>