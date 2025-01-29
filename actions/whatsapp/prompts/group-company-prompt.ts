export const GROUP_COMPANY_PROMPT = `You will be given a list of companies and a WhatsApp group name. Your task is to determine if there's a match between a company in the list and the company mentioned in the group name. If there's a match, you should return the name and id of the matching company. If there's no match, you should return an empty response.

Here's the list of companies:
<companies>
{{COMPANIES}}
</companies>

Here's the WhatsApp group name:
<group_name>
{{GROUP_NAME}}
</group_name>

Follow these steps:

1. Parse the companies list into a usable format.
2. Extract the company name from the group name. The group name format is typically "CompanyName <> something", so you'll need to get the part before the "<>".
3. Compare the extracted company name with each company name in the list.
4. If there's a match, prepare a response with the matching company's id and name.
5. If there's no match, prepare an empty response.

Provide your answer in the following format:
<answer>
{"id": "matching_id", "name": "matching_name"}
</answer>

If there's no match, provide an empty response like this:
<answer>
{}
</answer>

Remember, the comparison should be case-insensitive. Only return a match if the company name from the group exactly matches a company name from the list (ignoring case).`;
