<script setup lang="ts">
const url = useUrl()
const router = useRouter()

await navigateTo(url.lang(url.accountDashboard()), { replace: true })
</script>
