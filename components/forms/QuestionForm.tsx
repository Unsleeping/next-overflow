"use client";

import * as React from "react";
import { Editor } from "@tinymce/tinymce-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { questionsSchema } from "@/lib/validations";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { getTinyMCEConfig } from "@/lib/utils";
import { useTheme } from "@/context/ThemeProvider";
import { ITag } from "@/database/tag.model";

interface QuestionFormProps {
  mongoUserId: string;
  type?: "create" | "edit";
  questionDetails?: string;
}

const QuestionForm = ({
  mongoUserId,
  type = "create",
  questionDetails,
}: QuestionFormProps) => {
  const { mode } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const parsedQuestionDetails =
    questionDetails && JSON.parse(questionDetails || "");
  const form = useForm<z.infer<typeof questionsSchema>>({
    resolver: zodResolver(questionsSchema),
    defaultValues: {
      title: parsedQuestionDetails?.title || "",
      explanation: parsedQuestionDetails?.content || "",
      tags: parsedQuestionDetails?.tags.map((t: ITag) => t.name) || [],
    },
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function onSubmit(values: z.infer<typeof questionsSchema>) {
    setIsSubmitting(true);

    try {
      if (type === "edit") {
        await editQuestion({
          title: values.title,
          content: values.explanation,
          questionId: parsedQuestionDetails?._id,
          path: pathname,
        });

        router.push(`/question/${parsedQuestionDetails._id}`);
      } else {
        await createQuestion({
          title: values.title,
          content: values.explanation,
          tags: values.tags,
          author: JSON.parse(mongoUserId),
          path: pathname,
        });

        router.push("/");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleInputKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (event.key === "Enter" && field.name === "tags") {
      event.preventDefault();

      const tagInput = event.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();
      if (tagValue) {
        if (tagValue.length > 15) {
          return form.setError(field.name, {
            type: "required",
            message: "Tag must be less than 15 characters",
          });
        }
        if (!field.value.includes(tagValue as never)) {
          form.setValue(field.name, [...field.value, tagValue]);
          tagInput.value = "";
          form.clearErrors(field.name);
        } else {
          form.trigger();
        }
      }
    }
  };
  const handleTagRemove = (tag: string, field: any) => {
    const newTags = field.value.filter((t: string) => t !== tag);
    form.setValue(field.name, newTags);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Title&nbsp;<span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Be specific and imagine you&apos;re asking a question to another
                person.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Detailed explanation of your problem&nbsp;
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_MCE_KEY}
                  value={field.value || ""}
                  onBlur={field.onBlur}
                  onEditorChange={(content) => field.onChange(content)}
                  init={getTinyMCEConfig(mode)}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Introduce the problem and expand on what you put in the title.
                Minimum 20 characters.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Tags&nbsp;<span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <>
                  <Input
                    disabled={type === "edit"}
                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                    placeholder="Add tags..."
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                  />
                  {field.value.length > 0 && (
                    <div className="flex-start mt-2.5 gap-2.5">
                      {field.value.map((tag) => (
                        <Badge
                          key={tag}
                          className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                        >
                          {tag}
                          {type === "create" && (
                            <Image
                              src="/assets/icons/close.svg"
                              width={12}
                              height={12}
                              alt="close"
                              className="cursor-pointer object-contain invert-0 dark:invert"
                              onClick={() => handleTagRemove(tag, field)}
                            />
                          )}
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              </FormControl>

              <FormDescription className="body-regular mt-2.5 text-light-500">
                Add up to 3 tags to describe what your question is about. You
                need to press enter to add a tag.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="primary-gradient w-fit !text-light-900"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>{type === "edit" ? "Editings..." : "Posting..."}</>
          ) : (
            <>{type === "edit" ? "Edit Question" : "Ask Question"}</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default QuestionForm;
