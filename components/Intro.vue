<template>
    <div class="intro">
        <h1>blog.8-p.info</h1>
        <p>
            Hello! My name is Kazuyoshi Kato. I'm a software developer, Japanese and Seattle transplant.
        </p>
        <div class="row">
            <div class="column ja">
                <a href="https://blog.8-p.info/ja/">滞舎路日記</a> is my Japanese blog since mid-2016,
                where I write about tech, living abroad and some random thoughts.
            </div>
            <div class="column en">
                <a href="https://blog.8-p.info/en/">Kazu's Log</a> is my English blog since 2017,
                where I write about tech, hopefully more often.
            </div>
        </div>                
        <p>
            Previously, from 2008 to 2016, I was having a new blog every year to try different software
            without worrying much about data migration.
            It sounds crazy, and it may be.
        </p>
    </div>
</template>
<style scoped>
    h1 {
        font-size: 100%;
        margin: 1rem 1.5rem;
        padding: 0;
    }

    .column {
        margin: 10px 20px;
        padding: 15px;
    }

    @media (min-width: 800px) {
        h1 {
            text-align: right;
        }
        .column {
            width: 50%;
        }
    }

    .intro {
        padding: 10px 0;
    }

    .intro p {
        padding: 0;
        margin: 10px 40px;
    }

    .ja {
        border: 2px solid #FF4136;
    }

    .en {
        border: 2px solid #7FDBFF;
    }
</style>
