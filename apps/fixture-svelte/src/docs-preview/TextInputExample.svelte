<script lang="ts">
import TextInput from '@unofficial-krds/svelte/text-input';
import FormExample from './FormExample.svelte';
let actions = $state(0);
</script>
<FormExample>
  <TextInput label="신청인 이름" name="applicant" defaultValue="" type="text" size="medium" status="error" autocomplete="name" errorId="name-error" invalid iconAction={{ label: '이름 도움말', onAction: () => actions += 1 }} />
  <p id="name-error">신청인 이름을 입력해 주세요.</p>
  <p role="status">아이콘 버튼 실행 {actions}회</p>
</FormExample>
