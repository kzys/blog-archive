<template>
    <div class="intro">
        <h1>blog.8-p.info</h1>
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
        <div class="before">
            Previously I was doing one-blog-per-year experiment from 2008 to 2016.
            It sounds crazy, and it may be.
        </div>
    </div>
</template>
<style scoped>
    h1 {
        font-size: 120%;
        margin: 1rem 1.5rem;
        padding: 0;
    }

    .column {
        margin: 1rem .5rem;
        padding: 1rem;
    }

    .intro {
        margin: 0;
        padding: .5rem;
    }

    @media (min-width: 800px) {
        h1 {
            text-align: right;
        }
        .column {
            width: 50%;
        }

        .intro {
            padding: 1rem;
        }
    }

    .before {
        margin: 1rem 1.5rem;
    }

    .ja {
        border: 2px solid #FF4136;
    }

    .en {
        border: 2px solid #7FDBFF;
    }
</style>
