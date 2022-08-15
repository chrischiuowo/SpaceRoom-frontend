<template>
  <div class="search-bar">
    <div class="common-title">
      搜尋結果
    </div>
    <SearchBar />
    <div class="tool">
      <a
        class="back"
        @click.prevent="router.back()"
      >
        <i class="fa-solid fa-circle-arrow-left" />
      </a>
      <div class="tabs">
        <div
          class="tab"
          :class="{'active': nowSwitch===1}"
          @click="switchPage(1)"
        >
          貼文
        </div>
        <div
          class="tab"
          :class="{'active': nowSwitch=== 2}"
          @click="switchPage(2)"
        >
          使用者
        </div>
      </div>
    </div>
    <div class="search-content">
      <div class="contents">
        <div
          v-show="nowSwitch===1"
          class="content"
        >
          <template v-if="posts.length">
            <PostItem
              v-for="post in posts"
              :key="post._id"
              :post="post"
            />
          </template>
          <template v-else>
            <PostItem
              :post="{}"
            />
          </template>
        </div>
        <div
          v-show="nowSwitch===2"
          class="content"
        >
          <div class="users">
            <template v-if="users.length">
              <UserItem
                v-for="user in users"
                :key="user._id"
                :user="user"
              />
            </template>
            <template v-else>
              <UserItem
                :user="{}"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
  <PostBox />
</template>

<script setup>
import UserItem from '@/components/UserItem.vue'
import PostItem from '@/components/PostItem.vue'
import PostBox from '@/components/box/PostBox.vue'
import SearchBar from '@/components/SearchBar.vue'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import router from '@/router'
import { getPostsByRoute, getUsersByRoute } from '@/fetch/fetch'
import { useModalStore } from '@/stores/modal'
import { usePostStore } from '@/stores/post'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const modalStore = useModalStore()
const postStore = usePostStore()
const userStore = useUserStore()

const { posts } = storeToRefs(postStore)
const { user_id } = storeToRefs(userStore)
const { openLoading, closeLoading } = modalStore
const { patchPosts } = postStore

const nowSwitch = ref(1)
const users = ref([])
// 取得所有貼文
const getData = async () => {
  switch (nowSwitch.value) {
    case 1: {
      if (posts.value?.length) return
      openLoading()
      const { data: postsData } = await getPostsByRoute(route.query)
      await patchPosts(postsData.data)
      closeLoading()
      break
    }
    case 2: {
      if (users.value?.length) return
      openLoading()
      const { data: usersData } = await getUsersByRoute(route.query)
      const checkSelf = usersData.data.findIndex(user => user._id === user_id.value)
      if (checkSelf > -1) usersData.data.splice(checkSelf, 1)
      users.value = usersData.data
      closeLoading()
    }
  }
}
getData()

// 切換頁籤
const switchPage = (n) => {
  if (n === nowSwitch.value) return
  nowSwitch.value = n
  getData()
}
</script>

<style scoped lang="scss">
@import '../assets/scss/base/mixins';
@import '../assets/scss/base/variables';
.tool {
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 25px;
  .back {
    flex-shrink: 0;
    font-size: px(24);
    margin-right: 30px;
    cursor: pointer;
    user-select: none;
  }
  .tabs {
    width: 100%;
    display: flex;
    align-items: stretch;
    margin: 0 auto;
  }
  .tab {
    background-color: $c-white;
    border-radius: 8px;
    border: 2px solid $c-black;
    padding: 10px 15px;
    margin-right: 10px;
    transition: .5s;
    cursor: pointer;
    user-select: none;
    &.active {
      color: $c-white;
      background-color: $c-black;
    }
  }
}
.users {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
</style>