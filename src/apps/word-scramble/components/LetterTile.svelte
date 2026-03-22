<script>
  export let letter = '';
  export let index = 0;
  export let revealed = false;
  export let disabled = false;
</script>

<div 
  class="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white font-bold text-xl sm:text-2xl shadow-lg transform transition-all duration-200 {revealed ? 'bg-green-500' : ''} {disabled ? 'opacity-50' : 'hover:scale-105 active:scale-95'}"
  style="animation: fadeIn 0.3s ease-out {index * 50}ms both;"
>
  {letter.toUpperCase()}
</div>

<style>
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.8) rotateX(90deg);
    }
    to {
      opacity: 1;
      transform: scale(1) rotateX(0);
    }
  }
</style>
