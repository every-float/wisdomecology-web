<template>
    <div class="not-found">
        <back-prevpage to="-1"></back-prevpage>
        404
    </div>
</template>

<script>
    import BackPrevpage from '@/components/BackPrevpage';

    export default {
        components: {
            BackPrevpage,
        },
    }
</script>

<style lang="scss" scoped>
    .not-found{
        height: 100%;
        display: flex;
        display: -webkit-flex;
        justify-content: center;
        align-items: center;
        font-size: 2rem;
        background-color: #091220;
        color: #adadad;
    }
</style>