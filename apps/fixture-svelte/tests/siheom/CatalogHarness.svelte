<script lang="ts">
import { Checkbox, TextInput, QuantityToggle, Disclosure } from '@unofficial-krds/svelte';
let checked=$state(false), value=$state('initial'), requests=$state(0), opened=$state(false);
</script>
<form><Checkbox label="동의" name="consent" checked={checked} indeterminate={true} onCheckedChange={()=>requests++}/><TextInput label="이름" name="name" defaultValue="initial" onValueChange={()=>requests++}/><QuantityToggle label="수량" name="quantity" min={0} max={3}/><button type="reset">초기화</button></form>
<Disclosure label="도움말" contentId="help" open={opened} onOpenChange={()=>requests++}><input aria-label="상세 입력"/></Disclosure>
<output aria-label="요청 수">{requests}</output>
