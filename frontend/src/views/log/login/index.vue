<template>
    <div>
        <LayoutContent v-loading="loading" :title="$t('logs.login')">
            <template #toolbar>
                <div class="flex justify-between gap-2 flex-wrap sm:flex-row">
                    <div class="flex flex-wrap gap-3">
                        <el-button class="tag-button no-active" @click="onChangeRoute('OperationLog')">
                            {{ $t('logs.operation') }}
                        </el-button>
                        <el-button class="tag-button" type="primary" @click="onChangeRoute('LoginLog')">
                            {{ $t('logs.login') }}
                        </el-button>
                        <el-button class="tag-button no-active" @click="onChangeRoute('SystemLog')">
                            {{ $t('logs.system') }}
                        </el-button>
                    </div>
                    <div class="flex flex-wrap gap-3">
                        <TableSetting @search="search()" />
                        <TableSearch @search="search()" v-model:searchName="searchIP" />
                    </div>
                </div>
            </template>

            <template #search>
                <div class="flx-align-center">
                    <el-select v-model="searchStatus" @change="search()" clearable class="p-w-200">
                        <template #prefix>{{ $t('commons.table.status') }}</template>
                        <el-option :label="$t('commons.table.all')" value=""></el-option>
                        <el-option :label="$t('commons.status.success')" value="Success"></el-option>
                        <el-option :label="$t('commons.status.failed')" value="Failed"></el-option>
                    </el-select>

                    <el-button type="primary" plain @click="onClean()" class="ml-2.5">
                        {{ $t('logs.deleteLogs') }}
                    </el-button>
                </div>
            </template>
            <template #main>
                <ComplexTable :pagination-config="paginationConfig" :data="data" @search="search">
                    <el-table-column :label="$t('logs.loginIP')" prop="ip" />
                    <el-table-column :label="$t('logs.loginAddress')" prop="address" />
                    <el-table-column :label="$t('logs.loginAgent')" show-overflow-tooltip prop="agent" />
                    <el-table-column :label="$t('logs.loginStatus')" prop="status">
                        <template #default="{ row }">
                            <div v-if="row.status === 'Success'">
                                <el-tag type="success">{{ $t('commons.status.success') }}</el-tag>
                            </div>
                            <div v-else>
                                <el-tooltip class="box-item" effect="dark" :content="row.message" placement="top-start">
                                    <el-tag type="danger">{{ $t('commons.status.failed') }}</el-tag>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="createdAt"
                        :label="$t('commons.table.date')"
                        :formatter="dateFormat"
                        show-overflow-tooltip
                    />
                </ComplexTable>
            </template>
        </LayoutContent>
        <ConfirmDialog ref="confirmDialogRef" @confirm="onSubmitClean"></ConfirmDialog>
    </div>
</template>

<script setup lang="ts">
import ConfirmDialog from '@/components/confirm-dialog/index.vue';
import { dateFormat } from '@/utils/util';
import { cleanLogs, getLoginLogs } from '@/api/modules/log';
import { onMounted, reactive, ref } from 'vue';
import i18n from '@/lang';
import { MsgSuccess } from '@/utils/message';
import { useRouter } from 'vue-router';
const router = useRouter();

const loading = ref();
const data = ref();
const confirmDialogRef = ref();
const paginationConfig = reactive({
    cacheSizeKey: 'login-log-page-size',
    currentPage: 1,
    pageSize: 10,
    total: 0,
});
const searchIP = ref<string>('');
const searchStatus = ref<string>('');

const search = async () => {
    let params = {
        ip: searchIP.value,
        status: searchStatus.value,
        page: paginationConfig.currentPage,
        pageSize: paginationConfig.pageSize,
    };
    loading.value = true;
    await getLoginLogs(params)
        .then((res) => {
            loading.value = false;
            data.value = res.data.items;
            paginationConfig.total = res.data.total;
        })
        .catch(() => {
            loading.value = false;
        });
};

const onChangeRoute = async (addr: string) => {
    router.push({ name: addr });
};

const onClean = async () => {
    let params = {
        header: i18n.global.t('logs.deleteLogs'),
        operationInfo: i18n.global.t('commons.msg.delete'),
        submitInputInfo: i18n.global.t('logs.deleteLogs'),
    };
    confirmDialogRef.value!.acceptParams(params);
};

const onSubmitClean = async () => {
    await cleanLogs({ logType: 'login' });
    search();
    MsgSuccess(i18n.global.t('commons.msg.operationSuccess'));
};

onMounted(() => {
    search();
});
</script>
