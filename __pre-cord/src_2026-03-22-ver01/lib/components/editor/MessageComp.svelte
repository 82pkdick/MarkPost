<script lang="ts">
  import { responseMessageInit } from "../PostEditor.svelte";

  interface MessageCompProps {
    message: string;
    error: boolean;
    time: number;
  }

  let { message, error, time }: MessageCompProps = $props();

  let resMsg = $derived(message);
  let errorState = $derived(error);

  // time/1000 秒後にメッセージを消去
  const resMsgDelete = (time: number) => {
    window.setTimeout(() => {
      message = "";
      responseMessageInit();
    }, time);
  };

  const checkMsg = (msg: string) => {
    if (msg !== "") {
      resMsgDelete(time);
    }
  };

  /**
   * setTimeout な関数は $effect の中では動かないが、
   * 状態変数の変化を感知する関数を間に咬ませると動く.
   */
  $effect(() => {
    checkMsg(message);
  });
</script>

<div
  class="response-message base-bg fs-x011 {resMsg ? 'show' : ''} {errorState
    ? 'error'
    : ''}"
>
  {resMsg}
</div>

<style>
  .response-message {
    --msg-color: transparent;
    --msg-bdr: none;
    --msg-margin: 0;
    --msg-padding: 0;

    display: block;
    width: fit-content;
    margin: var(--msg-margin);
    padding: var(--msg-padding);
    color: var(--msg-color);
    text-align: left;
    border: var(--msg-bdr);
    z-index: 1000;
    &.show {
      --msg-color: var(--msg-success);
      --msg-margin: 5px auto 10px;
      --msg-padding: 10px 1rem;
      --msg-bdr: 1px solid var(--msg-color);
    }
    &.show.error {
      --msg-color: var(--msg-error);
    }
  }
</style>
