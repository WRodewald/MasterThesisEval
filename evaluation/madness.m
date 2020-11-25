clear all; close all;

N = 5;
M = 10000000;

x = [2,5,1,3,4]; 
%x = [2,3,4,5,1];
y = repmat(1:N,[M,1]);

for i = 1:M
    y(i,:) = randperm(N);
end

y(any(y == (1:N),2),:) = [];

y = unique(y,'rows');

matches = sum(x == y,2);


%histogram = [sum(matches==0), sum(matches==1), sum(matches==2), sum(matches==3), sum(matches==4), sum(matches==5)] / length(matches);

histogram = [sum(matches==0), sum(matches==1), sum(matches==2), sum(matches==3), sum(matches==4), sum(matches==5)];