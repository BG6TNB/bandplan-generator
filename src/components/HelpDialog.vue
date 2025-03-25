<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { CircleHelp } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { useStorage } from "@vueuse/core";

const helpDialogSeen = useStorage("helpDialogSeen", false);

const handleOpenChange = (open: boolean) => {
  if (!open) {
    helpDialogSeen.value = true;
  }
};
</script>

<template>
  <Dialog :defaultOpen="!helpDialogSeen" @update:open="handleOpenChange">
    <DialogTrigger as-child>
      <Button variant="ghost" size="icon">
        <CircleHelp class="w-4 h-4" />
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Welcome to Bandplan Generator!</DialogTitle>
        <DialogDescription>
          Here are a few tips to get you started
        </DialogDescription>
      </DialogHeader>
      <ul class="list-disc pl-4">
        <li>
          You can customize the bandplan to your liking, IARU R1 is just an
          example
        </li>
        <li>Your progress is saved automatically</li>
        <li>Add or remove bands in the sidebar</li>
        <li>
          You can adjust the CW/PHONE/DIGI segments, add Range and Point markers
        </li>
        <li>Click "Copy link" to share your bandplan with others</li>
        <li>
          If you have any feedback, reach out to
          <a href="mailto:ly1ja@vurk.lt" class="underline">ly1ja@vurk.lt</a>
        </li>
      </ul>
      <DialogFooter class="sm:justify-start">
        <DialogClose as-child>
          <Button type="button" variant="default">Got it!</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
